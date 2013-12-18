<?php
/*
		Mighty Mini Cards
		This module displays a feed of cards from a selected brand.

		Options:
				heading
				sub_hedaing
				source
				sort
				count
 */

date_default_timezone_set('UTC');

if (isset($options->heading)): $heading = '<h2>' . $options->heading . '</h2>'; endif;
if (isset($options->sub_heading)): $sub_heading = '<h3>' . $options->sub_heading . '</h3>'; endif;

// Set up sorting.
$sort = '';
if (isset($options->sort) && $options->sort === 'viral'): $sort = '&viral_sort=1'; endif;

// Call API
$Mighty = new Mighty();
$json = $Mighty->getJSON('http://qa.mini.aol.com/api/1.0/cards');

if (isset($json)):

		$cards = $json->data->cards;

if (count($cards) > 0):
?>
<div class="mighty-mini">
		<div class="cards-list">
		<?=@$heading?>
		<?=@$sub_heading?>

<? foreach ($cards as $card):
	$type_class = "card-type-" . $card->card_type->name;
	$source = $card->source;

	$updated = date_create();
	date_timestamp_set($updated, $card->updated);

	$now = date_create();
	$diff = date_diff($updated, $now);
	$ago = $diff->format("%h") . "h";
?>

		<article class="card card-list <?=$type_class?>">

			<? switch ($card->card_type->name) {
			case "headline": ?>

			<? break; ?>
			<? case "quote": ?>

			<? break; ?>
			<? case "video": ?>

			<div class="card-video-poster" style="background-image:url('<?=$card->content->media[1]->url?>')">
				<div class="card-play"><i class="icon-play"></i></div>
			</div>

			<? break; ?>
			<? case "image": ?>

			<div class="card-image" style="background-image:url('<?=$card->media[0]['url']?>');"></div>

			<? break; ?>
			<? } ?>

			<? if ($card->state) { ?>
			<h4 class="card-state card-state-<?=$card->state?>"><?=ucfirst($card->state)?></h4>
			<? } ?>

			<h2 class="headline"><?=$card->content->text?></h2>
			<p class="card-comment"><?=$card->content->comment?></p>

			<p class="card-meta">
				<span class="card-icon pull-left">
					<img src="http://pbs.twimg.com/profile_images/378800000833708794/2e214d2fde9f61190b1ffa5d601d762c_normal.png">
				</span>

				<span class="card-meta-content">
					<span class="card-author-name"><?=$card->author->display_name?>
						<? if ($source->name) { ?>
							via <span class="card-source-name"><?=$source->name?></span>
						<? } ?>
					</span>
				</span>

				<span class="card-meta-end">
					<span class="card-ago"><?=$ago?></span>
				</span>
			</p>

		</article>
		<?  endforeach; ?>

		</div>
</div>
<?php
endif;
endif;
