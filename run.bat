
cowtchoox web/main.cow --no-pdf
mv web/out.html index.html

xdg-open http://localhost:8080/index.html
python3 -m http.server 8080

