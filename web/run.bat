
echo "compiling main"
cowtchoox main.cow --no-pdf
mv out.html index.html

echo "compiling tests"
cowtchoox tests.cow --no-pdf
mv out.html tests.html

xdg-open http://localhost:8080/index.html
python3 -m http.server 8080

