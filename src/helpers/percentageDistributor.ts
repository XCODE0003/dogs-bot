export async function percentageDistributor(value: number, percent: number): Promise<number> {
    let statePercent = undefined
    const percentLength = percent.toString().length

    if (percentLength === 1) {
        statePercent = Number(`0.0${percent}`)
    } else if (percentLength === 2) {
        statePercent = Number(`0.${percent}`)
    }

    return Math.round(value * statePercent)
}