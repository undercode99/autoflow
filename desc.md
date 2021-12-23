

Entry                  | Description                                              | Equivalent To
-----                  | -----------                                              | -------------
@yearly (or @annually) | Jalankan setahun sekali, tengah malam, 1 Januari         | 0 0 0 1 1 *
@monthly               | Jalankan sebulan sekali, tengah malam, tgl pertama bulan | 0 0 0 1 * *
@weekly                | Jalankan seminggu sekali, tengah malam antara Sab / Ming | 0 0 0 * * 0
@daily (or @midnight)  | Jalankan sekali sehari, tengah malam                     | 0 0 0 * * *
@hourly                | Jalankan sekali dalam satu jam, awal jam 
@every <duration>      | Example: @every 3h2ms


