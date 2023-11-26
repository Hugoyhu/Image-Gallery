# image-gallery
This is my image gallery! It automatically loads newest images and displays important EXIF metadata under the image. Optimizes loading to reduce image sizes, but clicking will link to the full size image. 

Images are uploaded to Cloudinary (important EXIF data and a CDN link are also stored in a Supabase database table). Each time the website is loaded, the images are loaded from the db without any hardcoding. 

It's live at [corgis.cyou](corgis.cyou).
