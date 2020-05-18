println("Running Julia")

println(ARGS[1])
println(isfile(ARGS[1]))
println(isfile(string("/app/", ARGS[1])))

println(pwd())
println(readdir())