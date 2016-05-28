ng-flat-jalaali-datepicker
===

یک دایرکتیو دیت پیکر جلالی ساده برای انگولار که از مومنت.جی اس استفاده می‌کند

![ng-flat-jalaali-datepicker screenshot](http://s7.picofile.com/file/8252672284/taghvim.png)

## پیش‌نمایش

[پیش‌نمایشی ببینید](http://thg303.github.io/jalaali-datepicker-demo/)

## امکانات
* فرمت تاریخ قابل سفارشی سازی خروجی به صورت متن یا ابجکت تاریخ جاوا اسکریپت
* قابلیت محدود کردن کمترین تاریخ قابل انتخاب و بیشترین تاریخ قابل انتخاب
* امکان فعال/غیرفعال کردن تاریخی در آینده
* انتخاب سریع ماه و سال
* قابلیت ارائه تاریخ انتخاب شده بر مبنای میلادی و جلالی بصورت همزمان

## پیش‌نیازها
* Angularjs >=1.2
* Moment.js
* Moment-jalaali.js >=0.4.0

## نصب

1. `npm install --save ng-flat-jalaali-datepicker`
2. متصل کردن فایل `/dist/ng-flat-jalaali-datepicker.js` و `/dist/ng-flat-jalaali-datepicker.css`
3. اضافه کردن ماجول `'ngFlatjalaaliDatepicker'` بعنوان دپندنسی به ماجول انگولار مورد نظر


## نحوه استفاده

این دایرکتیو فقط به صورت اتریبیوت قابل استفاده است

```html
<input type="text" ng-model="date" ng-flat-jalaali-datepicker>
```

```html
<button ng-model="date" ng-flat-jalaali-datepicker>Pick a date</button>
```

## آپشن‌ها

### اتریبیوت‌ها:
* `datepicker-config`: **Object** - ابجکت پیکربندی
* `gregorian-formatted-picked-date`: **String** - تاریخ انتخاب شده به مبنای میلادی
* `gregorian-picked-date`: **Object** - تاریخ انتخاب شده به صورت یک شی moment.js
```html
<input type="text" ng-model="date" datepicker-config="yourCustomConf" gregorian-formatted-picked-date="gfdate" gregorian-picked-date="gdate"  ng-flat-jalaali-datepicker>Pick a date</button>
picked date is {{gfdate}}
```

### خصوصیات قابل تعریف در شئ پیکربندی

* `dateFormat`: **String** - فرمت moment-jalaali.js تاریخی که در `ng-model`. اگر فرمتی تعریف نشود فرمت پیش فرض تاریخ جاوا اسکریپت در نظر گرفته می‌شود:
Eg:`'jDD/jMM/jYYYY'`

* `gregorianDateFormat`: **String** - فرمت نمایش تاریخ میلادی. اگر تعریف نشده باشد معادل همان `dateFormat` در نظر گرفته می‌شود
* `minDate`: **Object** - مشخص کننده کمترین تاریخ قابل انتخاب توسط کاربر. حتمن می‌بایست یک شئ moment.js باشد
* `dropDownYears`: **Number** - تعداد سال‌هایی که در لیست پایین افتادنی می‌بایست ظاهر شوند. مقدار پیش فرض ۱۰ عدد است
* `maxDate`: **Object** - مشخص کننده بیشترین تاریخ قابل انتخاب توسط کاربر. حتمن می‌بایست یک شئ moment.js باشد
* `allowFuture`: **Boolean** - اجازه انتخاب روزهای آینده (بعد از فردا) را ممکن می‌کند


## مشارکت
برای مشارکت در بهبود این کد پیش‌نیازهای لازم را نصب نموده و سپس دستور زیر را وارد نمایید.

`gulp watch`

## تقدیر و سپاس
* «رمی چاناود» بخاطر کد پروژه اصلی:
[RemiAWE](https://github.com/RemiAWE/ng-flat-datepicker)
* «بهرنگ نوروزی نیا» بخاطر پروژه تقویم جلالی بر مبنای مومنت:
[behrang](https://github.com/jalaali/moment-jalaali)
