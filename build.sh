#!/bin/bash

uuid=wintile-beyond@GrylledCheez.xyz
rm ${uuid}.zip
glib-compile-schemas schemas/
zip -r9 ${uuid}.zip extension.js keybindings.js metadata.json prefs.js settings.ui schemas
