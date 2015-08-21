#!/bin/bash

rm zelda.js

# fetch records
mongo localhost/nesoi -eval "db.terrain.find({},{_id:0}).forEach(function(doc){print(JSON.stringify(doc)+',');});" >> zelda.js

# Preface with array variable

echo "var cells;" >> zelda.json.tmp
echo "" >> zelda.json.tmp
echo "cells = [" >> zelda.json.tmp 

tail -n +3 zelda.js >> zelda.json.tmp 


sed -i '' '$ s/.$//' zelda.json.tmp

echo "]" >>  zelda.json.tmp
echo "" >>  zelda.json.tmp
# echo "exports.cells = zelda;" >>  zelda.json.tmp

mv zelda.json.tmp zelda.js