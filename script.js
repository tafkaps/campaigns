const openingHours = {
    0: [[11, 21]], // Sonntag
    1: [], // Montag: Geschlossen
    2: [[11, 14], [17, 22]], // Dienstag
    3: [[10, 13], [15, 16], [17, 22]], // Mittwoch
    4: [[11, 14], [17, 22]], // Donnerstag
    5: [[10, 11], [13, 15]], // Freitag
    6: [[11, 23]]  // Samstag
};

const dayValues = {
    0: 200,  // Sonntag
    1: 0,    // Montag (geschlossen)
    2: 150,  // Dienstag
    3: 140,  // Mittwoch
    4: 170,  // Donnerstag
    5: 300,  // Freitag
    6: 260   // Samstag
};

function calculateMinutes() {
    const start = new Date(document.getElementById("start").value);
    const end = new Date(document.getElementById("end").value);
    if (start >= end) {
        document.getElementById("result").innerHTML = "Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.";
        document.getElementById("result").style.display = 'block';
        return;
    }

    let totalMinutes = 0;
    let insideMinutes = 0;
    let outsideMinutes = 0;
    let insideValue = 0;
    let outsideValue = 0;
    let currentTime = new Date(start);

    // Adjusted loop to exclude the end minute from counting
    while (currentTime < end) { // Changed from `<=` to `<`
        totalMinutes++;
        const dayOfWeek = currentTime.getDay();
        const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
        const openRanges = openingHours[dayOfWeek] || [];

        let isInside = false;
        for (const range of openRanges) {
            if (currentHour >= range[0] && currentHour < range[1]) {
                isInside = true;
                break;
            }
        }

        if (isInside) {
            insideMinutes++;
            const totalOpenMinutes = openRanges.reduce((acc, range) => acc + (range[1] - range[0]) * 60, 0);
            const minuteValue = dayValues[dayOfWeek] / totalOpenMinutes;
            insideValue += minuteValue;
        } else {
            outsideMinutes++;
        }

        currentTime.setMinutes(currentTime.getMinutes() + 1);
    }

    const totalValue = insideValue + outsideValue;

    // Funktion zur Umwandlung von Minuten in HH:MM Format
    function formatHoursAndMinutes(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
    }

    document.getElementById("result").innerHTML = `
        <table>
            <tr>
                <th>Period</th>
                <th>Minutes</th>
                <th>Hours</th>
                <th>Contacts</th>
            </tr>
            <tr>
                <td>Total</td>
                <td>${totalMinutes}</td>
                <td>${formatHoursAndMinutes(totalMinutes)}</td>
            </tr>
            <tr>
                <td>Closed</td>
                <td>${outsideMinutes}</td>
                <td>${formatHoursAndMinutes(outsideMinutes)}</td>
            </tr>
            <tr>
                <td>Open</td>
                <td>${insideMinutes}</td>
                <td>${formatHoursAndMinutes(insideMinutes)}</td>
                <td>${insideValue.toFixed(3)}</td>
            </tr>
        </table>
        <div class="json-block">
            <pre>{
  "epaperGroupId": 1234,
  "epaperId": 5678,
  "campaignId": 9010,
  "startedAt": "${start.toISOString()}",
  "endedAt": "${end.toISOString()}",
  "contacts": ${totalValue.toFixed(3)}
  "geolocation" {
    "lattitude": 51.22464,
    "longitute": 6.786719
  }
}</pre>
        </div>
    `;
    document.getElementById("result").style.display = 'block';
}