#!/bin/bash

 rm kian.js

# fetch records
mongo localhost/nesoi -eval "db.terrain_kian.find({},{_id:0}).forEach(function(doc){print(JSON.stringify(doc)+',');});" >> kian.js

# Preface with array variable

echo "var cells;" >> kian.json.tmp
echo "" >> kian.json.tmp
echo "cells = [" >> kian.json.tmp 

tail -n +3 kian.js >> kian.json.tmp 


sed -i '' '$ s/.$//' kian.json.tmp

echo "]" >>  kian.json.tmp
echo "" >>  kian.json.tmp
# echo "exports.cells = kian;" >>  kian.json.tmp

mv kian.json.tmp kian.js