const jwtVerify = require("../middleware/jwtVerify");
const User = require('../model/User')
const router = require("express").Router();

router.get("/", jwtVerify, async (req, res) => {
  try {
    const { username } = req.query;

    const agg = [
      {
        $search: {
          autocomplete: {
            query: username,
            path: "username",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          password: 0,
        },
      },
    ];

    const result = await User.aggregate(agg)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
