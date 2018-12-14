cd ..
yarn build
cd support
cp ../build/lock.min.js netlify-deploy/lock.min.js
cp ../build/lock.min.js.map netlify-deploy/lock.min.js.map
cp ../build/en.js netlify-deploy/en.js
npx -p postcss-cssnext -p postcss-cli -c "postcss index.css --use postcss-cssnext -o netlify-deploy/index.p.css"
# cd netlify-deploy
# netlify deploy --dir=. --prod
cd ..