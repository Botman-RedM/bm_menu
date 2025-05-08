# BM Menu - Dynamic RedM Menu System

A highly customizable, old-west themed menu system for RedM with support for multiple input types and intuitive styling options.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![RedM](https://img.shields.io/badge/RedM-Compatible-red)
![License](https://img.shields.io/badge/license-Apache%202.0-green)

## Features at a Glance

🎨 **Western Themed Design**
- Paper-style background with authentic feel
- Period-appropriate fonts
- Fully customizable appearance

🛠️ **Multiple Input Types**
- Standard buttons with images
- Text input fields
- Number inputs with validation
- Range sliders
- Dropdown selects
- Radio button groups

⚙️ **Developer Features**
- Simple, promise-based API
- Comprehensive validation
- Multiple/single selection modes
- Flexible positioning
- Size presets
- Full documentation

## Quick Start

1. Download and extract to your resources folder
2. Add to your server.cfg:
```
ensure bm_menu
```

3. Basic usage:
```lua
local menuData = {
    {
        id = 1,
        title = "Option 1",
        description = "Description",
        image = "https://example.com/image.png"
    }
}

local config = {
    multiple = false,
    size = "medium",
    position = "center"
}

local result = exports.bm_menu:OpenMenu(menuData, config)
```

## Documentation

### Menu Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| multiple | boolean | false | Enable multiple selections |
| size | string | "medium" | Size preset ("small", "medium", "large") |
| position | string | "center" | Position ("left", "right", "center") |
| maxWidth | number | nil | Custom maximum width |
| maxHeight | number | nil | Custom maximum height |
| backgroundImage | string | "paper.webp" | Background image name |
| fontStyle | string | "Caveat" | Font family |

### Input Types

**Text Input**
```lua
{
    id = 1,
    title = "Name",
    inputType = "text",
    placeholder = "John Smith",
    maxLength = 32
}
```

**Number/Range**
```lua
{
    id = 2,
    inputType = "number", -- or "range"
    min = 0,
    max = 100,
    step = 1
}
```

**Select/Radio**
```lua
{
    id = 3,
    inputType = "select", -- or "radio"
    options = {
        {label = "Option 1", value = "opt1"},
        {label = "Option 2", value = "opt2"}
    }
}
```

**Button**
```lua
{
    id = 4,
    title = "Action",
    description = "Description",
    image = "image.png"
}
```

### Result Handling
```lua
local result = exports.bm_menu:OpenMenu(menuData, config)
if result then
    -- Selected buttons
    for _, selected in ipairs(result.selected) do
        print(selected.title)
    end

    -- Input values
    for id, value in pairs(result.inputs) do
        print(id, value)
    end
end
```

## Examples

### Character Creation
```lua
local menuData = {
    {
        id = 1,
        title = "Name",
        inputType = "text",
        required = true
    },
    {
        id = 2,
        title = "Background",
        inputType = "select",
        options = {
            {label = "Outlaw", value = "outlaw"},
            {label = "Lawman", value = "lawman"}
        }
    }
}
```

### Shop Menu
```lua
local menuData = {
    {
        id = 1,
        title = "Revolver",
        description = "$12.50",
        image = "revolver.png"
    },
    {
        id = 2,
        title = "Amount",
        inputType = "number",
        min = 1,
        max = 10
    }
}
```

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
