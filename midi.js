const TRANSPOSITION = 1
const NOTES_DOWN = 0

const {Midi} = require('@tonejs/midi')
const fs = require('fs')
const owo = new Midi(fs.readFileSync('Touhou 6/th06_11.mid'))
const base = {}

//owo.tracks = [owo.tracks[20],owo.tracks[22], owo.tracks[28]]

for(const ti in owo.tracks) {
    const track = owo.tracks[ti]
    const trackconv = []
    const noteticks = [...new Set(track.notes.map(m=>m.time))]
    for(const notetime of noteticks) {
        const timenoteson = []
        for(const note of track.notes){
            if(note.time == notetime) {
                timenoteson.push(note.midi - (TRANSPOSITION * 12) - NOTES_DOWN)
            }
        }
        trackconv.push([Math.floor(notetime*100000000)/100000000,timenoteson])
    }
    const noteticks2 = [...new Set(track.notes.map(m=>m.time+m.duration))]
    const trackconv2 = []
    for(const notetime of noteticks2) {
        const timenotesoff = []
        for(const note of track.notes) {
            if(note.time+note.duration == notetime) {
                timenotesoff.push(note.midi - (TRANSPOSITION * 12) - NOTES_DOWN)
            }
        }
        trackconv2.push([Math.floor(notetime*100000000)/100000000,timenotesoff])
    }

    base['track'+ti] = [trackconv,trackconv2]
}
fs.writeFileSync('input.seq',JSON.stringify(base))
console.log('done')