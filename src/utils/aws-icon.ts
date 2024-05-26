export const convertIconName = (icon: string) => {
    if (!icon) {
        return ''
    }

    icon = icon.replace('Amazon', 'AWS');
    icon = icon.replace(/\s+/g, '-').toLowerCase();
    return icon;
}

export const checkIconExist = async (icon: string) => {
    if (!icon) {
        return false;
    }

    const iconUrl = `https://app.eraser.io/static/canvas-icons/${icon}.svg`;

    // check url exist
    const response = await fetch(iconUrl);
    return response.ok;
}
