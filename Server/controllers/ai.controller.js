import main from "../config/gemini.js";
import Product from "../models/product.model.js";

export const smartAISearch = async (req, res) => {
  try {
    const userQuery = req.query.q || "";

    // Validate query
    if (!userQuery.trim()) {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }

    // Ask Gemini to refine & expand search
    const prompt = `
      You are a search term corrector and expander for an e-commerce grocery store.
      Input: "${userQuery}"
      Tasks:
      1. Correct spelling mistakes.
      2. If the input is a broad category (like "drinks", "fruits", "vegetables"), expand it into 5–10 specific grocery product names that a store might have. 
         Example: "fruits" -> "apple, banana, mango, grapes, orange".
      3. Only output a comma-separated list of keywords without explanations or extra words.
    `;

    const refinedText = await main(prompt);
    const keywords = refinedText.split(",").map(k => k.trim()).filter(k => k.length > 0);

    // Build a search query for both `name` & `category`
    const queryConditions = [];
    keywords.forEach(keyword => {
      queryConditions.push({ name: { $regex: keyword, $options: "i" } });
      queryConditions.push({ category: { $regex: keyword, $options: "i" } });
    });

    // Search DB
    const products = await Product.find({ $or: queryConditions });

    if (!products.length) {
      return res.status(404).json({
        message: "Product not available",
        success: false,
      });
    }

    // Return response
    res.status(200).json({
      searchQuery: userQuery,
      refinedSearch: keywords,
      products,
      success: true
    });

  } catch (error) {
    console.error("Smart search error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// smart prouct recommendation
export const smartProductRecommendation = async (req, res) => {
  try {
    const productId = req.params.id;

    // get the prouct by Id to fetch category
    const product = await Product.findById(productId);

    if(!product) return res.status(404).json({
      message: 'Product Not Found',
      success: false
    })

    // fetch the category of the product from the db
    const category = product.category;

    // generate the prompt for gemini
    const prompt = `Suggest 5 popular product names from the category "${category}". Provide only the product names separated by commas.`;

    // fetch gemini
    const geminiResponse = await main(prompt);

    // parse recomnded names
    const recommendedNames = geminiResponse
    .split(",")
    .map(name => name.trim())
    .filter(Boolean);

    // Fetch full product details from DB matching recommended names and category, excluding current product
    let recommendedProducts = [];
    if (recommendedNames.length > 0) {
      recommendedProducts = await Product.find({
        category,
        name: { $in: recommendedNames },
        _id: { $ne: productId }
      }).limit(5);
    }

    // If AI did not return names or none found, fallback to top 5 products from category (excluding current)
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find({
        category,
        _id: { $ne: productId }
      }).limit(5);
    }

    return res.status(200).json({ 
      message: "Here Are The Recommeded Products",
      recommendedProducts , 
      success: true 
    })

  } catch (error) {
    console.error("Something Went Wrong:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
