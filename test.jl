using WAV


println("Running Julia")

println(ARGS[1])
println(isfile(ARGS[1]))
println(isfile(string("/app/", ARGS[1])))

println(pwd())
println(readdir())

println(1)
source, samplerate = wavread(ARGS[1])
println(2)
