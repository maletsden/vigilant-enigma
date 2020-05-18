using WAV
using MFCC: mfcc
using LinearAlgebra
import Base.MathConstants: φ


println("Running Julia")

println(ARGS[1])
println(isfile(ARGS[1]))
println(isfile(string("/app/", ARGS[1])))

println(pwd())
println(readdir())


# packs in one second
const θ = 16

# size of windows
const τ = 4θ

# spacing
const δ = θ ÷ 4

const Timings = Dict{Tuple{Int, Int}, Float64}

function gettimings(sourcefile::String; disk=true)
    println(sourcefile)
    println(1)
    source, samplerate = wavread(sourcefile)
    println(2)
end

if !isfile(ARGS[1])
    println("$(ARGS[1]) is a non-existent file")
    exit(1)
end

gettimings(ARGS[1], disk=false)
