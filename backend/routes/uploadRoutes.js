import express from "express"
import multer from "multer"

const router = express.Router()

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(
      null,
      "uploads/guides"
    )

  },

  filename(req, file, cb) {

    cb(
      null,
      Date.now() +
      "-" +
      file.originalname
    )

  }

})

const upload =
  multer({ storage })

router.post(
  "/guide-image",
  upload.single("image"),
  (req, res) => {

    res.json({

      success: true,

      url:
        `/uploads/guides/${req.file.filename}`

    })

  }
)

export default router