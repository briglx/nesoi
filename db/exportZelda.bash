#!/bin/bash

rm zelda2.js

# fetch records
mongo localhost/nesoi -eval "db.terrain.find({},{_id:0}).forEach(function(doc){print(JSON.stringify(doc)+',');});" >> zelda2.js

# Preface with array variable

echo "var cells;" >> zelda2.json.tmp
echo "" >> zelda2.json.tmp
echo "cells = [" >> zelda2.json.tmp 

tail -n +3 zelda2.js >> zelda2.json.tmp 


sed -i '' '$ s/.$//' zelda2.json.tmp

echo "]" >>  zelda2.json.tmp
echo "" >>  zelda2.json.tmp
# echo "exports.cells = zelda2;" >>  zelda2.json.tmp

mv zelda2.json.tmp zelda2.js