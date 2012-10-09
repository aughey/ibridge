# Simple line count metric
cat *.js | grep  '[a-zA-Z]' | grep -v console |  grep -v '^[ 	]*\/\/' | wc
