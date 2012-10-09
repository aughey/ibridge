level="SIMPLE"
#level="ADVANCED"
for f in *.js; do 
	echo "Compiling $f"
	grep -v 'console' < $f > compiled/foo
	curl -s -d compilation_level=${level}_OPTIMIZATIONS -d output_format=text -d output_info=compiled_code --data-urlencode "js_code@compiled/foo" http://closure-compiler.appspot.com/compile > compiled/$f
	rm -f compiled/foo
done

