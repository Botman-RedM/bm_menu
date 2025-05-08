local p = nil
local menuData = nil
local menuDefaultsData = nil
local isMenuOpen = false

local function validateMenuResult(menuDefaults, data)
    if menuDefaults and not menuDefaults.multiple and type(data.value) == "table" and #data.value > 1 then return false end
    if data.inputs then
        for id, value in pairs(data.inputs) do
            local menuItem = nil
            for _, item in ipairs(menuData) do
                if tostring(item.id) == tostring(id) then
                    menuItem = item
                    break
                end
            end
            if menuItem then
                if menuItem.required and (value == nil or value == "") then return false end
                if menuItem.inputType == "number" or menuItem.inputType == "range" then
                    local num = tonumber(value)
                    if not num then return false end
                    if menuItem.min and num < menuItem.min then return false end
                    if menuItem.max and num > menuItem.max then return false end
                end
                if menuItem.inputType == "text" and menuItem.maxLength then
                    if #value > menuItem.maxLength then return false end
                end
                if (menuItem.inputType == "select" or menuItem.inputType == "radio") and menuItem.options then
                    local validOption = false
                    for _, opt in ipairs(menuItem.options) do
                        if opt.value == value then
                            validOption = true
                            break
                        end
                    end
                    if not validOption then return false end
                end
            end
        end
    end
    return true
end

local function closeMenu()
    if not isMenuOpen then return end
    isMenuOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = "closeMenu"
    })
end

exports("OpenMenu", function(menu, menuDefaults)
    if p then
        p:resolve(nil)
        p = nil
    end
    if not menu then return end
    if not menuDefaults then menuDefaults = {} end
    menuDefaults.size = menuDefaults.size or "medium"
    menuDefaults.multiple = menuDefaults.multiple or false
    menuDefaults.position = menuDefaults.position or "center"
    menuDefaults.maxWidth = menuDefaults.maxWidth or nil
    menuDefaults.maxHeight = menuDefaults.maxHeight or nil
    menuDefaults.backgroundImage = menuDefaults.backgroundImage or "paper.webp"
    menuDefaults.fontStyle = menuDefaults.fontStyle or "Caveat"
    menuDefaultsData = menuDefaults
    menuData = menu
    p = promise.new()
    isMenuOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "openMenu",
        menu = menu,
        defaults = menuDefaults
    })
    local result = Citizen.Await(p)
    p = nil
    return result
end)
exports("CloseMenu", function()
    closeMenu()
    if p then
        p:resolve(nil)
        p = nil
    end
end)

RegisterNUICallback("menuResult", function(data, cb)
    if not p then
        cb("ok")
        return
    end
    if data.cancelled then
        p:resolve(nil)
        isMenuOpen = false
        SetNuiFocus(false, false)
        cb("ok")
        return
    end
    local valid = validateMenuResult(menuDefaultsData, data)
    if not valid then
        cb(false)
        return
    end
    local results = {
        selected = {},
        inputs = {}
    }
    if type(data.value) == "table" and #data.value > 0 then
        for _, v in ipairs(data.value) do
            for _, item in ipairs(menuData) do
                if item.id == v then
                    table.insert(results.selected, item)
                    break
                end
            end
        end
    end
    if type(data.inputs) == "table" then
        results.inputs = data.inputs
    end
    if next(results.inputs) or next(results.selected) then
        p:resolve(results)
    else
        p:resolve(nil)
    end
    isMenuOpen = false
    SetNuiFocus(false, false)
    cb("ok")
end)

AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    closeMenu()
end)
