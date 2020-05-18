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
    println(1)
    source, samplerate = wavread(sourcefile)
    println(2)

    channel = ceil(Int, last(size(source)) * rand())
    source = source[Int(samplerate) >> 2 : end, channel]

    # samples in one pack
    β = Int(samplerate) ÷ θ

    # length of packs
    ℓ = length(source) ÷ β

    xs = first(mfcc(source, samplerate; wintime=1/θ, steptime=1/θ))
    xs = transpose(xs)

    timings = Timings()
    println(3)

end


gettimings(ARGS[1], disk=false)
