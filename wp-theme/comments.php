<? if ( have_comments() ) {

	echo module('commentlist')
		->classes('box-content')
		->tag('section')
		->ctrl();
} ?>

<?=
module('commentform')
	->classes('box-content')
	->tag('section')
	->ctrl() ?>
