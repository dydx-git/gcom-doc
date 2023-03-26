

export enum Company {
    BuffaloWebWork = 2,
    ItecDesigns = 1,
    ThreadTapes = 3
}

export const CompanyLabel: { [key in Company]: string } = {
    [Company.BuffaloWebWork]: 'Buffalo Web Work',
    [Company.ItecDesigns]: 'Itec Designs',
    [Company.ThreadTapes]: 'Thread Tapes'
};

