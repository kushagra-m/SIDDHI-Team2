echo "Switching to branch master"
git checkout master

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -i "C:\Users\Dell\Downloads\siddhiteam2_key (1).pem" -r build/* azureuser2@104.211.117.234:/var/www/104.211.117.234/

echo "Done!"
