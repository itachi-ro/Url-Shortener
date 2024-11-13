const express = require("express")
const router = express.Router()
const { handleGenerateNewShortURL, handleGetAnalytics, handleVisitSite } = require('../controllers/url')

router.post("/", handleGenerateNewShortURL)
router.get('/:shortId', handleVisitSite)
router.get('/analytics/:shortId', handleGetAnalytics)

module.exports = router;
