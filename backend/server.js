import { supabase } from "./supabase.js"
import express from "express"
import cors from "cors"

import session from "express-session"

import passport from "passport"

import { Strategy as DiscordStrategy }
from "passport-discord"

import uploadRoutes
from "./routes/uploadRoutes.js"

import path from "path"

import dotenv from "dotenv"

dotenv.config()
const app = express()
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.RENDER === "true"
const frontendUrl =
  process.env.FRONTEND_URL?.replace(/\/+$/, "")
const discordCallbackUrl =
  `${frontendUrl}/auth/discord/callback`

if (!frontendUrl) {
  throw new Error("FRONTEND_URL is required")
}

app.use(express.json())

app.use(
  ["/api", "/auth"],
  (req, res, next) => {
    res.set("Cache-Control", "no-store")
    next()
  }
)

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://warera-india-hub.vercel.app"
    ],
    credentials: true
  })
)

app.use(
  "/uploads",
  express.static("uploads")
)

app.set("trust proxy", 1)

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    proxy: true,

    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: "lax"
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.get("/session-test", (req, res) => {

  req.session.test = "HELLO"

  res.json({
    ok: true
  })

})

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime()
  })
})

app.get("/session-read", (req, res) => {

  res.json({
    test: req.session.test || null
  })

})

app.use(
  "/api/upload",
  uploadRoutes
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(
  new DiscordStrategy(
    {
      clientID:
        process.env.DISCORD_CLIENT_ID,

      clientSecret:
        process.env.DISCORD_CLIENT_SECRET,

      callbackURL:
        discordCallbackUrl,

      scope: [
        "identify"
      ]
    },

    async (accessToken, refreshToken, profile, done) => {

    try {

        const { data: existingUser } =
        await supabase
            .from("users")
            .select("*")
            .eq("discord_id", profile.id)
            .single()

        if (!existingUser) {

        await supabase
            .from("users")
            .insert({
            discord_id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            role: "writer"
            })

        }

        return done(null, profile)

    } catch (err) {

        console.error(err)

        return done(err)

    }

    }
  )
)

app.get(
  "/auth/discord",
  passport.authenticate("discord")
)

app.get(
  "/auth/discord/callback",

  passport.authenticate(
    "discord",
    {
      failureRedirect: "/login-failed"
    }
  ),

  (req, res) => {

    console.log("USER AFTER LOGIN:")
    console.log(req.user)

    console.log("SESSION AFTER LOGIN:")
    console.log(req.session)

    console.log(
      "Redirecting to:",
      `${frontendUrl}/dashboard/`
    )

    req.session.save(err => {

      if (err) {
        console.error("Failed to save login session:", err)
        return res.redirect("/login-failed")
      }

      res.redirect(
        `${frontendUrl}/dashboard/`
      )

    })

  }
)

app.get(
  "/auth/logout",

  (req, res) => {

    req.logout(() => {

      req.session.destroy(() => {

        res.clearCookie(
          "connect.sid",
          {
            secure: isProduction,
            httpOnly: true,
            sameSite: "lax"
          }
        )

        res.redirect(
          frontendUrl
        )

      })

    })

  }
)

app.get("/api/me", async (req, res) => {

  console.log("===== API /me =====")
  console.log("SESSION:")
  console.log(req.session)

  console.log("USER:")
  console.log(req.user)

  if (!req.user) {

    return res.json({
      loggedIn: false
    })

  }

  try {

    const { data: dbUser }
      = await supabase
          .from("users")
          .select("*")
          .eq(
            "discord_id",
            req.user.id
          )
          .single()

    res.json({

      loggedIn: true,

      user: {

        id:
          req.user.id,

        username:
          req.user.username,

        avatar:
          req.user.avatar,

        role:
          dbUser?.role || "author"

      }

    })

  }

  catch(err) {

    console.error(err)

    res.status(500).json({
      error:
        "Server Error"
    })

  }

})

app.get("/api/dashboard", async (req, res) => {

  if (!req.user) {

    return res.status(401).json({
      error: "Not logged in"
    })

  }

  try {

    const { data: dbUser, error: userError } =
      await supabase
        .from("users")
        .select("id, role")
        .eq("discord_id", req.user.id)
        .single()

    if (userError || !dbUser) {
      throw userError || new Error("User not found")
    }

    let guidesQuery =
      supabase
        .from("guides")
        .select(
          "id, title, slug, status, created_at, updated_at"
        )
        .order("created_at", {
          ascending: false
        })

    const canReview =
      dbUser.role === "admin" ||
      dbUser.role === "supervisor"

    if (!canReview) {
      guidesQuery =
        guidesQuery.eq("author_id", dbUser.id)
    }

    const [
      { data: guides, error: guidesError },
      countryResponse
    ] = await Promise.all([
      guidesQuery,
      fetch(
        "https://api3.warera.io/trpc/country.getCountryById",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            countryId: "6813b6d546e731854c7ac862"
          })
        }
      ).catch(err => {
        console.error("Warera country request failed:", err)
        return null
      })
    ])

    if (guidesError) {
      throw guidesError
    }

    const countryPayload =
      countryResponse?.ok
        ? await countryResponse.json()
        : null

    const country =
      countryPayload?.result?.data

    res.json({
      stats: {
        total: guides.length,
        pending:
          guides.filter(
            guide => guide.status === "pending"
          ).length,
        approved:
          guides.filter(
            guide => guide.status === "approved"
          ).length
      },
      recentGuides:
        guides.slice(0, 5),
      country: country
        ? {
            citizens:
              country.rankings
                ?.countryActivePopulation
                ?.value ?? null,
            developmentRank:
              country.rankings
                ?.countryDevelopment
                ?.rank ?? null,
            productionBonus:
              country.strategicResources
                ?.bonuses
                ?.productionPercent ?? null,
            allies:
              country.allies?.length ?? 0,
            currentWars:
              country.warsWith?.length ?? 0,
            updatedAt:
              country.updatedAt ?? null
          }
        : null
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to load dashboard"
    })

  }

})

app.get(
  "/debug-session",
  (req, res) => {

    res.json({

      session: req.session,

      passport:
        req.session?.passport,

      user:
        req.user

    })

  }
)


app.get("/api/country", async (req, res) => {

  try {

    const response = await fetch(
      "https://api3.warera.io/trpc/country.getCountryById",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryId: "6813b6d546e731854c7ac862"
        })
      }
    )

    const data = await response.json()

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to fetch country data"
    })

  }

})

app.get("/api/categories", async (req, res) => {

  try {

    const { data, error } =
      await supabase
        .from("guide_categories")
        .select("*")

    if (error) {
      throw error
    }

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to load categories"
    })

  }

})

app.get("/api/guides/category/:slug", async (req, res) => {

  try {

    const categorySlug =
      req.params.slug

    const { data: category, error: catError } =
      await supabase
        .from("guide_categories")
        .select("*")
        .eq("slug", categorySlug)
        .single()

    if (catError) {
      throw catError
    }

    const { data: guides, error: guideError } =
      await supabase
        .from("guides")
        .select("*")
        .eq("category_id", category.id)
        .eq("status", "approved")

    if (guideError) {
      throw guideError
    }

    res.json({
      category,
      guides
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to load guides"
    })

  }

})

app.post("/api/guides", async (req, res) => {

  if (!req.user) {

    return res.status(401).json({
      error: "Not logged in"
    })

  }

  try {

    const {
      title,
      slug,
      category_id,
      content,
      excerpt
    } = req.body

    const { data: dbUser, error: userError } =
      await supabase
        .from("users")
        .select("id")
        .eq("discord_id", req.user.id)
        .single()

    if (userError || !dbUser) {
      throw userError || new Error("User not found")
    }

    const { data, error } =
      await supabase
        .from("guides")
        .insert({
          title,
          slug,
          category_id,
          content,
          excerpt,
          author_id: dbUser.id,
          status: "pending"
        })
        .select()

    if (error)
      throw error

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: err.message
    })

  }

})

app.get("/api/review/pending", async (req, res) => {

  try {

    const { data, error } =
      await supabase
        .from("guides")
        .select("*")
        .eq("status", "pending")

    if (error)
      throw error

    res.json(data)

  }

  catch(err) {

    console.error(err)

    res.status(500).json({
      error: err.message
    })

  }

})

app.post(
  "/api/review/approve/:id",

  async (req, res) => {

    try {

      const { id } = req.params

      const { data, error } =
        await supabase
          .from("guides")
          .update({
            status: "approved"
          })
          .eq("id", id)
          .select()

      if (error)
        throw error

      res.json(data)

    }

    catch(err) {

      console.error(err)

      res.status(500).json({
        error: err.message
      })

    }

  }
)

app.get("/api/guide/:slug", async (req, res) => {

  try {

    const { slug } = req.params

    const { data, error } =
      await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .single()

    if (error) {

      return res.status(404).json({
        error: "Guide not found"
      })

    }

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Server Error"
    })

  }

})

app.get(
  "/api/guides/edit/:id",

  async (req, res) => {

    try {

      const { id } =
        req.params

      const { data, error } =
        await supabase
          .from("guides")
          .select("*")
          .eq("id", id)
          .single()

      if (error)
        throw error

      res.json(data)

    }

    catch (err) {

      console.error(err)

      res.status(500).json({
        error: err.message
      })

    }

  }
)

app.put(
  "/api/guides/:id",

  async (req, res) => {

    try {

      const { id } =
        req.params

      const {
        title,
        excerpt,
        content
      } = req.body

      const { data, error } =
        await supabase
          .from("guides")
          .update({

            title,

            excerpt,

            content,

            updated_at:
              new Date()
                .toISOString(),

            status:
              "pending"

          })
          .eq("id", id)
          .select()

      if (error)
        throw error

      res.json(data)

    }

    catch (err) {

      console.error(err)

      res.status(500).json({
        error: err.message
      })

    }

  }
)

app.get("/api/my-guides", async (req, res) => {

  if (!req.user) {

    return res.status(401).json({
      error: "Not logged in"
    })

  }

  try {

    const { data: userData } =
      await supabase
        .from("users")
        .select("*")
        .eq("discord_id", req.user.id)
        .single()

    if (!userData) {

      return res.status(404).json({
        error: "User not found"
      })

    }

    const { data, error } =
      await supabase
        .from("guides")
        .select("*")
        .eq("author_id", userData.id)
        .order("created_at", {
          ascending: false
        })

    if (error)
      throw error

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Server Error"
    })

  }

})


app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Backend running on port ${process.env.PORT || 3000}`
  )
  console.log(
    `Discord callback URL: ${discordCallbackUrl}`
  )
})

