tail.date = {
	humanize: function(timeUTC) {
		var here = new Date(),
			now = here.getTime(),
			diff = now - timeUTC;
		var second = 1000, minute = 60*second, hour = minute*60, day = hour*24, week = day*7;
		if(diff<minute) return ' less than a minute ago';
		else if(minute<=diff && diff<minute*2) return ' a minute ago';
		else if(minute*2<=diff && diff<10*minute) return ' a few minutes ago';
		else if(10*minute<=diff && diff<hour) return ' '+Math.floor(diff/minute)+' minutes ago';
		else if(hour<=diff && diff<hour*2) return ' an hour ago';
		else if(hour*2<=diff && diff<hour*5) return ' '+Math.floor(diff/hour)+' hours ago';
		else if(hour*5<=diff && diff<day) return ' today';
		else if(day<=diff && diff<day*2) return ' yesterday';
		else if(day*2<=diff && diff<week) return ' '+Math.floor(diff/day)+' days ago';
		else if(week<=diff && diff<week*2) return ' last week';
		else if(week*2<= diff) {
			var date = new Date(timeUTC),
				string = date.toDateString();
			return string.substring(3,string.length);
		}
	}
}