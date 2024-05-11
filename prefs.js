'use strict';

import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class WinTileExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        let builder = Gtk.Builder.new();
        builder.add_from_file(`${this.path}/settings.ui`);
        let gridPage = builder.get_object('gridPage');
        let behaviorPage = builder.get_object('behaviorPage');
        window.add(gridPage);
        window.add(behaviorPage);

        let gsettings = this.getSettings();
        const bindSettings = (key, input) => {
            key.value = gsettings.get_value(input).deep_unpack();
            gsettings.bind(input, key, 'active', Gio.SettingsBindFlags.DEFAULT);
        };

        const connectAndSetInt = (key, input) => {
            key.value = gsettings.get_value(input).deep_unpack();
            key.connect('value-changed', entry => {
                gsettings.set_int(input, entry.value);
            });
        };

        let ultrawideOnlyInput = builder.get_object('ultrawideOnlyInput');
        let nonUltrawideGroup = builder.get_object('nonUltrawideGroup');

        const toggleUltrawide = () => {
            if (ultrawideOnlyInput.active) {
                // Show rows and columns options
                nonUltrawideGroup.show();
            } else {
                // Hide rows and columns options
                nonUltrawideGroup.hide();
            }
        };

        // settings that aren't toggles need a connect
        connectAndSetInt(builder.get_object('colsSettingInt'), 'cols');
        connectAndSetInt(builder.get_object('rowsSettingInt'), 'rows');
        connectAndSetInt(builder.get_object('nonUltraColsSettingInt'), 'non-ultra-cols');
        connectAndSetInt(builder.get_object('nonUltraRowsSettingInt'), 'non-ultra-rows');
        connectAndSetInt(builder.get_object('previewDistanceSettingInt'), 'distance');
        connectAndSetInt(builder.get_object('previewDelaySettingInt'), 'delay');
        connectAndSetInt(builder.get_object('gapSettingInt'), 'gap');

        // all other settings need a bind
        bindSettings(builder.get_object('ultrawideOnlyInput'), 'ultrawide-only');
        bindSettings(builder.get_object('maximizeInput'), 'use-maximize');
        bindSettings(builder.get_object('minimizeInput'), 'use-minimize');
        bindSettings(builder.get_object('previewInput'), 'preview');
        bindSettings(builder.get_object('doubleWidthInput'), 'double-width');
        bindSettings(builder.get_object('debugInput'), 'debug');
        ultrawideOnlyInput.connect('notify::active', toggleUltrawide);

        // make sure that the non-ultrawide menu is hidden unless it's enabled
        toggleUltrawide();
    }
}
