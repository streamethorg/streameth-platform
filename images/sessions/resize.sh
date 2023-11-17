#!/bin/sh

for filename in $1/*.png; do
    echo "Resizing $filename"
    convert $filename -thumbnail '1280' -quality 80 $filename
done
