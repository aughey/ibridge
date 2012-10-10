for f in *.js; do 
	echo "Compiling $f"
	grep -v 'console' < $f | ./node_modules/uglify-js/bin/uglifyjs > compiled/$f
done

