import { supabase } from "./supabase.js"
import express from "express"
import cors from "cors"

import session from "express-session"

import passport from "passport"

import { Strategy as DiscordStrategy }
from "passport-discord"

import dotenv from "dotenv"

dotenv.config()
const app = express()
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

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
        "http://localhost:3000/auth/discord/callback",

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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
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

    res.redirect(
        "http://localhost:5173/dashboard/"
    )
 }
)

app.get("/api/me", (req, res) => {

  console.log(req.user)

  if (!req.user) {

    return res.json({
      loggedIn: false
    })

  }

  res.json({
    loggedIn: true,

    user: {
      id: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar
    }
  })

})

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

  try {

    if (!req.user) {

      return res.status(401).json({
        error: "Not logged in"
      })

    }

    const {
      title,
      excerpt,
      category_id,
      content
    } = req.body

    const slug =
      title
        .toLowerCase()
        .replaceAll(" ", "-")

    const { data, error } =
      await supabase
        .from("guides")
        .insert({
          title,
          slug,
          excerpt,
          category_id,
          content,

          status: "pending"
        })
        .select()

    if (error) {
      throw error
    }

    res.json(data)

  }

  catch(err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to create guide"
    })

  }

})

app.post("/api/guides", async (req, res) => {

  try {

    const {
      title,
      slug,
      category_id,
      content,
      excerpt,
      author_id
    } = req.body

    const { data, error } =
      await supabase
        .from("guides")
        .insert({
          title,
          slug,
          category_id,
          content,
          excerpt,
          author_id,
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


app.listen(3000, () => {
  console.log("Backend running on port 3000")
})

