#!/bin/bash

uuid=wintile-beyond@GrylledCheez.xyz
rm -f build/*
glib-compile-schemas schemas/
zip -r9 build/${uuid}.zip extension.js keybindings.js metadata.json prefs.js settings.ui schemas
