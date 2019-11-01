export default function (country) {
    switch (country) {
        case "DZA":
        case "KEN":
        case "CHN":
        case "VEN":
        case "PAK":
            return ["National Identity Card"];

        case "EGY":
        case "TZA":
        case "TUN":
        case "ARM":
        case "MNG":
        case "YEM":
        case "AUS":
        case "FIJ":
        case "NZL":
        case "BHS":
        case "BRB":
        case "BMU":
        case "GRL":
        case "JAM":
        case "BLR":
        case "FRO":
        case "ISL":
        case "ISR":
            return ["Driving Licence"];

        case "JPN":
            return ["Residence Permit"];

        case "KWT":
            return ["Identity Card", "Driving License"];

        case "IND":
            return ["National Identity Card (Aadhaar)", "Tax Identity Card"];

        case "CIV":
        case "MAR":
        case "NGA":
        case "ZAF":
        case "UGA":
        case "AZE":
        case "BGD":
        case "HKG":
        case "IDN":
        case "JOR":
        case "MYS":
        case "THA":
        case "VNM":
        case "ARG":
        case "BOL":
        case "BRA":
        case "CHL":
        case "COL":
        case "ECU":
        case "PRY":
        case "PER":
        case "URY":
        case "CRI":
        case "DOM":
        case "GTM":
        case "PRI":
        case "TTO":
        case "ALB":
        case "BIH":
        case "DNK":
        case "GEO":
        case "GIB":
        case "GRC":
            return ["National Identity Card", "Driving Licence"];

        case "ETH":
            return ["National Identity Card", "Residence Permit"];

        case "SAU":
        case "GBR":
            return ["Driving Licence", "Residence Permit"];

        case "MEX":
            return ["Driving Licence", "Voter Identity Card"];

        case "RUS":
            return ["Passport (External)", "Driving Licence"];

        case "OMN":
        case "QAT":
        case "TUR":
        case "ARE":
        case "CAN":
        case "AUT":
        case "BEL":
        case "BGR":
        case "HRV":
        case "CYP":
        case "CZE":
        case "EST":
        case "FIN":
        case "FRA":
        case "DEU":
        case "HUN":
        case "ITA":
        case "LVA":
        case "LIE":
        case "LTU":
        case "LUX":
        case "MKD":
        case "MLT":
        case "MDA":
        case "MCO":
        case "MNE":
        case "NLD":
        case "NOR":
        case "POL":
        case "PRT":
        case "ROU":
        case "SRB":
        case "SVK":
        case "SVN":
        case "ESP":
        case "SWE":
        case "CHE":
        case "UKR":
            return ["National Identity Card", "Driving Licence", "Residence Permit"];

        case "SGP":
            return ["National Identity Card", "Driving Licence", "Work Permit (Employment Card)"];

        case "IRL":
            return ["2015 Passport Card", "Driving Licence", "Residence Permit"];

        case "USA":
            return ["Passport Card", "National Identity Card", "Driving Licence", "Residence Permit (Green Card)", "Work Permit (Authorisation Card)"];

        case "PHL":
            return ["National Identity Card", "Driving Licence", "Voter ID", "Postal ID", "Social Security ID", "Professional Qualification ID"];

        default:
            return [];
    }
}
