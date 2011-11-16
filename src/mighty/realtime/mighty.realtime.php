<?php

// Set up data options.
$dataOptions = '';
$count = ''; // Var for limiting the number of posts


if ( isset( $options ) ) {
	foreach ( $options as $key => $value ) {
		$dataOptions .= ' data-' . $key . '="' . $value . '"';
		
		if ( $key == "count" ){
			$count .= $value; // This will pickup the count from data-count. It limits the number of posts to be displayed in the widget.
		}
		
	}
}

$count = (!empty($count)) ? $count : 4;

/*
 * The following curl method should be used on production. 
 */
 
$c = curl_init();
curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($c, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
curl_setopt($c, CURLOPT_URL, 'http://www.huffingtonpost.com/api/?t=most_popular_merged&viral_sort=1&i=1h');

$content = curl_exec($c);
curl_close($c);

$json = json_decode($content);

/*
 * This function is to sort the array based on viral_views
 */
 
function sortStdArray($array,$index) {
	$sort=array() ;
	$return=array() ;
	
	for ($i=0; isset($array[$i]); $i++)
		$sort[$i]= $array[$i]->{$index};
		
		arsort($sort) ;
	
	foreach($sort as $k=>$v)
		$return[]=$array[$k] ;
		
		return $return;
}


/*
 * This function is to truncate the title..
 */

function truncate ($str, $length=10, $trailing='...') {
	  $length-=mb_strlen($trailing);
	  if (mb_strlen($str)> $length) {
		 // string exceeded length, truncate and add trailing dots
		 return mb_substr($str,0,$length).$trailing;
	  }else{
		 // string was already short enough, return the string
		 $res = $str;
	  }
	  return $res;
}

 $output=sortStdArray($json->response,"viral_views"); // This is commented, since most of the popular stories are from AOL. 

?>

<div class="mighty-realtime">
<h2 class="header">What's Being Read</h2>
		<ul class="mighty-realtime-ul">
<?php

	foreach($output as $key=>$value){ // Comment this, if sorted results are needed.
//	foreach($json->response as $key=>$value){  // Uncomment this line, if sorted results are not required.
		if ( $key <= $count-1 ) {
				$url = $value->entry_url;
				$title = ($value->entry_front_page_title) ? $value->entry_front_page_title : $value->entry_title;
				$vertical = $value->vertical_name;
				$views = number_format($value->viral_views);
				
				// Doing the following bit to assign vertical colors for non-huffingtonpost sites. HP API does not return any color for non-HP sites. 
				
				if (!empty($value->vertical_color)){
						$vcolor = $value->vertical_color;
				} else {
					if ( $vertical == "AOL TV" ) {
							$vcolor = "006B9A";
					} elseif ( $vertical == "Daily Finance" ) {
							$vcolor = "288BCB";
					} elseif ( $vertical == "Moviefone Blog" ) {
							$vcolor = "ED382E";
					} else {
							$color = "3BD512";	
					} 
				}				
				
?>
			<li class="mighty-realtime-li" data-vcolor="<?php echo "#".$vcolor; ?>" title="<?php echo $title; ?>">
				<span class="mighty-realtime-title" data-vcolor="<?php echo "#".$vcolor; ?>">
					<a href="<?php echo $url ?>"><?php echo truncate($title,40); ?></a>
				</span>
				<a class="arrow"></a>
				<span class="mighty-realtime-views">
					<a href="<?php echo $url ?>"><?php echo $views; ?></a>
				</span>						
				
			</li>
			
			
<?php	
		}	
	} // End Foreach
	
?>
		</ul>
		<div class="footer-links">
			<a class="huffpost-logo" href="http://www.huffingtonpost.com/">Breaking News and Opinion on The Huffington Post</a>
			<a class="link" href="#">
				Get This Widget
			</a>
		</div>
<a name="mighty" class="mighty-realtime"<?=$dataOptions?> href="http://www.mightymodules.com/realtime/">Get the <b>What's Being Read (Realtime) Widget</b></a>
</div>
