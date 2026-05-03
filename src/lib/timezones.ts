export interface TimezoneOption {
    value: string
    region: string
    location: string
    label: string
    offset: number
}

export const getTimezones = (): TimezoneOption[] => {
    return Intl.supportedValuesOf('timeZone').map(tz => {
        const region = tz.split('/')[0]
        const location = tz.split('/').slice(1).join('/').replace(/_/g, ' ') || ''
        
        const offset = new Intl.DateTimeFormat('en', {
            timeZone: tz,
            timeZoneName: 'shortOffset'
        }).formatToParts().find(part => part.type === 'timeZoneName')?.value ?? ''
        const offsetNumber = offset === 'GMT' ? 0 : parseFloat(offset.replace('GMT', ''))
        return {
            value: tz,
            region,
            location,
            label: `${location} (${offset})`,
            offset: offsetNumber
        }
    }).sort((a, b) => b.offset - a.offset)
}

// TODO: fix this function so that it will work as a flatter array with combobox
export const getTimezonesByRegion = (): Record<string, TimezoneOption[]> => {
    const timezones = getTimezones()
    return timezones.reduce((groups, tz) => {
        if (!groups[tz.region]) {
            groups[tz.region] = []
        }
        groups[tz.region].push(tz)
        return groups
    }, {} as Record<string, TimezoneOption[]>)
}