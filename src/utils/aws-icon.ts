const hardcodedIcons = {
    "AWS SNS": "aws-simple-notification-service",
    "k8s-rsreplicaset": "aws-elastic-kubernetes-service",
    "External": "external-link",
    "AWS SQS & Lambda": "aws-lambda",
}

export const convertIconName = (icon: string) => {
    if (!icon) {
        return ''
    }
    if (icon in hardcodedIcons) {
        return hardcodedIcons[icon]
    }


    icon = icon.replace('Amazon', 'AWS');
    icon = icon.replace(/\s+/g, '-').toLowerCase();
    return icon;
}
