const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

async function getPinterest(img) {
  try {
    const { data } = await axios.get("https://id.pinterest.com/search/pins/?autologin=true&q=" + img, {
      headers: {
        cookie: "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0="
      },
    });

    const $ = cheerio.load(data);
    const result = [];
    const image = [];
    $("div > a").each((_, element) => {
      const link = $(element).find("img").attr("src");
      if (link !== undefined) result.push(link);
    });
    for (let v of result) {
      image.push(v.replace(/236/g, "736"));
    }
    image.shift(); // Remove the first image (if necessary)
    return image;
  } catch (error) {
    throw error;
  }
}

// Define the /api/pinterest endpoint
app.get('/api/pinterest', async (req, res) => {
  const { query, count = 6 } = req.query; // Get the search query and count from query parameters
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const data = await getPinterest(query);
    const images = data.slice(0, Math.min(data.length, count)); // Limit the number of images returned

    // Pretty-print the JSON response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(images, null, 2)); // Pretty print with 2 spaces for indentation
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching images from Pinterest.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

