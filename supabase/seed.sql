-- ==============================================================================
-- MenuMint - Realistic Seed Data
-- Demo restaurant "Cafe Aroma" with categories and items
-- ==============================================================================

DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_restaurant_id UUID := '11111111-1111-1111-1111-111111111111';
  v_cat_hot UUID := '22222222-2222-2222-2222-222222222221';
  v_cat_cold UUID := '22222222-2222-2222-2222-222222222222';
  v_cat_snacks UUID := '22222222-2222-2222-2222-222222222223';
  v_cat_desserts UUID := '22222222-2222-2222-2222-222222222224';
BEGIN
  -- Insert demo profile if not exists
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (v_user_id, 'Aarav Sharma', 'owner@cafearoma.in')
  ON CONFLICT (id) DO NOTHING;

  -- Insert restaurant "Cafe Aroma"
  INSERT INTO public.restaurants (
    id, owner_id, name, slug, description, restaurant_type,
    logo_url, cover_image_url, phone, whatsapp, instagram,
    address, city, state, country, currency, template_key,
    primary_color, secondary_color, published
  ) VALUES (
    v_restaurant_id,
    v_user_id,
    'Cafe Aroma',
    'cafe-aroma',
    'Artisanal coffee, handcrafted brews, and freshly toasted treats in an ambient setting.',
    'Café',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    '+919876543210',
    '+919876543210',
    'cafearoma.official',
    'Shop 14, Ground Floor, Indiranagar 100ft Road',
    'Bengaluru',
    'Karnataka',
    'India',
    'INR',
    'cafe',
    '#10B981',
    '#047857',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    published = EXCLUDED.published;

  -- Insert Categories
  INSERT INTO public.categories (id, restaurant_id, name, description, position, is_visible)
  VALUES
    (v_cat_hot, v_restaurant_id, 'Hot Beverages', 'Freshly brewed teas and espresso classics', 0, true),
    (v_cat_cold, v_restaurant_id, 'Cold Beverages', 'Chilled refreshers, cold brews, and shakes', 1, true),
    (v_cat_snacks, v_restaurant_id, 'Snacks & Bites', 'Crispy toasted sandwiches and quick munchies', 2, true),
    (v_cat_desserts, v_restaurant_id, 'Desserts', 'Decadent sweet endings baked fresh daily', 3, true)
  ON CONFLICT (id) DO NOTHING;

  -- Insert Menu Items
  -- Hot Beverages
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, food_type, is_available, is_visible, is_bestseller, is_spicy, is_vegan, is_jain, position)
  VALUES
    (v_restaurant_id, v_cat_hot, 'Masala Chai', 'Traditional Indian spiced milk tea infused with cardamom, ginger, and cloves.', 30.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80', 'veg', true, true, true, false, false, true, 0),
    (v_restaurant_id, v_cat_hot, 'Ginger Chai', 'Strong milk tea brewed with freshly crushed aromatic ginger root.', 35.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, true, false, true, 1),
    (v_restaurant_id, v_cat_hot, 'Cappuccino', 'Rich dark espresso topped with velvety steamed milk foam and cocoa dusting.', 120.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, false, true, 2),
    (v_restaurant_id, v_cat_hot, 'Café Latte', 'Smooth double espresso poured gently with silky steamed whole milk.', 130.00, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, false, true, 3),

  -- Cold Beverages
    (v_restaurant_id, v_cat_cold, 'Cold Coffee', 'Thick creamy blended cold coffee served with chocolate syrup swirl.', 150.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80', 'veg', true, true, true, false, false, true, 0),
    (v_restaurant_id, v_cat_cold, 'Iced Americano', 'Bold espresso shots poured over crystal ice and crisp chilled water.', 110.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, true, true, 1),
    (v_restaurant_id, v_cat_cold, 'Mango Shake', 'Real Alphonso mango pulp blended with rich cream and ice cream.', 140.00, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, false, false, 2),

  -- Snacks
    (v_restaurant_id, v_cat_snacks, 'Veg Grilled Sandwich', 'Fresh tomatoes, cucumbers, bell peppers, mint chutney and melted cheddar.', 120.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, false, true, 0),
    (v_restaurant_id, v_cat_snacks, 'Paneer Tikka Sandwich', 'Spiced tandoori paneer cubes, capsicum, and smoky chipotle spread.', 160.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80', 'veg', true, true, true, true, false, false, 1),
    (v_restaurant_id, v_cat_snacks, 'French Fries', 'Golden salted crispy potato fries served with spiced tomato salsa.', 100.00, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80', 'veg', true, true, false, false, true, true, 2),

  -- Desserts
    (v_restaurant_id, v_cat_desserts, 'Chocolate Brownie', 'Warm gooey Belgian chocolate fudge brownie with dark chocolate chips.', 150.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80', 'egg', true, true, false, false, false, false, 0),
    (v_restaurant_id, v_cat_desserts, 'Cheesecake', 'Classic New York baked cheesecake with wild berry compote drizzle.', 180.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', 'egg', true, true, true, false, false, false, 1)
  ON CONFLICT DO NOTHING;

END $$;
