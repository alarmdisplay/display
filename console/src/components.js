const components = {
  AnnouncementList: {
    name: 'Bekanntmachungen',
    icon: 'bullhorn',
    options: true,
  },
  Clock: {
    name: 'Uhr',
    icon: 'clock',
    options: false,
  },
  DWDWarningMap: {
    name: 'DWD-Warnkarte',
    icon: 'cloud-showers-heavy',
    options: true,
  },
  NextUpList: {
    name: 'Termine',
    icon: 'calendar',
    options: false,
  },
}

export function getAvailableComponentTypes() {
  return Object.keys(components);
}

export function getComponentName(componentType) {
  return components[componentType]?.name || componentType;
}

export function getComponentIcon(componentType) {
  return components[componentType]?.icon || 'cube';
}

export function isComponentConfigurable(componentType) {
  return !!(components[componentType]?.options);
}

export function isValidComponentType(componentType) {
  return getAvailableComponentTypes().includes(componentType);
}
