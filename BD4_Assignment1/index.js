let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { resturants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    const results = await fetchAllRestaurants();
    if (results.resturants.length === 0) {
      return res.status(404).json({ message: 'No restaurants Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let results = await fetchRestaurantsById(id);

    if (results.restaurants === undefined) {
      return res
        .status(404)
        .json({ message: 'No restaurants Found for id: ' + id });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants Found for cuisine: ' + cuisine });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE LOWER(isVeg) = LOWER(?) AND LOWER(hasOutdoorSeating) = LOWER(?) AND LOWER(isLuxury) = LOWER(?)';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg || null;
    let hasOutdoorSeating = req.query.hasOutdoorSeating || null;
    let isLuxury = req.query.isLuxury || null;
    let results = await fetchRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortRestaurantByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  let results = await sortRestaurantByRating();
  try {
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  let results = await fetchAllDishes();
  try {
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let results = await getDishById(id);
    if (results.dishes === undefined) {
      return res.status(404).json({ message: 'No Dishes Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE LOWER(isVeg) = LOWER(?)';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg || null;
    let results = await getDishesByFilter(isVeg);
    if (results.dishes === undefined) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortDishesByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log('Server running on port 3000'));
