-- Actualizar items de store que no tienen imagen
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1599408162172-fe5bdf5fcbbd?w=600&h=600&fit=crop' WHERE id = 1 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1598921821422-487625be2864?w=600&h=600&fit=crop' WHERE id = 2 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&h=600&fit=crop' WHERE id = 3 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop' WHERE id = 4 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=600&fit=crop' WHERE id = 5 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop' WHERE id = 6 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop' WHERE id = 7 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop' WHERE id = 8 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=600&fit=crop' WHERE id = 9 AND ("imageUrl" IS NULL OR "imageUrl" = '');
UPDATE store_items SET "imageUrl" = 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&h=600&fit=crop' WHERE id = 10 AND ("imageUrl" IS NULL OR "imageUrl" = '');

SELECT 'Store items images updated!' as status;
