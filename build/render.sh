#!/bin/bash
# usage: render.sh <avatar.mp4> <out.mp4> [extra ffmpeg args]
IN="$1"; OUT="$2"; shift 2
T=(0 7.5 15.0 24.0 33.5 40.9 50.2 59.18)
args=(-i "$IN" -loop 1 -framerate 25 -i bg.png)
for k in 1 2 3 4 5 6 7; do args+=(-loop 1 -framerate 25 -i card$k.png); done
f="[1]trim=duration=${T[7]},setpts=PTS-STARTPTS[bg];"
f+="[0]crop=1080:1320:0:80,chromakey=0x0AB748:0.13:0.07,despill=type=green,split[a1][a2];"
f+="[a1]scale=918:-1[big];[a2]scale=540:-1[small];"
prev=bg
for k in 1 2 3 4 5 6 7; do
  s=${T[$((k-1))]}; e=${T[$k]}; fo=$(echo "$e-0.3" | bc)
  f+="[$((k+1))]format=rgba,trim=duration=${T[7]},fade=in:st=$s:d=0.3:alpha=1,fade=out:st=$fo:d=0.3:alpha=1[c$k];"
  if [ $k = 7 ]; then xy="0:0"; else xy="60:110"; fi
  f+="[$prev][c$k]overlay=$xy:enable='between(t,$s,$e)'[v$k];"; prev=v$k
done
f+="[v7][big]overlay=81:H-h:enable='lt(t,${T[6]})'[v8];"
f+="[v8][small]overlay=540:H-h:enable='gte(t,${T[6]})',format=yuv420p[out]"
ffmpeg -v error -y "${args[@]}" -filter_complex "$f" -map "[out]" -map 0:a -c:v libx264 -crf 18 -preset medium -c:a copy -t ${T[7]} -movflags +faststart "$@" "$OUT"
