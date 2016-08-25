<?php

namespace core; 

class PostField {
  static $meta_box_text_template;
  static $getBooleanFieldValue;
  static $getTextFieldValue;
  static $getFileFieldValue;
  static $getGalleryFieldValue;

  function __construct( $model, $slug, $name, $label ) {
    $this->model  = $model;
    $this->slug   = $slug;
    $this->name   = $name;
    $this->label  = $label;
	
	$that = $this;
    $that->meta_box_checkbox_generator = function( $post ) use ($that){
      $checked = ( $that->getValue( $post ))? 'checked': '';
      $nonce_html = wp_nonce_field( $that->slug, $that->slug . '_nonce', true );
      ?>
        <label for="<?= $that->slug ?>"><?= _e( ucfirst( $that->label )) ?></label>
        <input id="<?= $that->slug ?>" type="checkbox" name="<?= $that->slug ?>" <?= $checked ?>>
      <?php
    };

    $that->meta_box_text_input_generator = function( $post ) use($that) {
      $nonce_html = wp_nonce_field( $that->slug, $that->slug . '_nonce', true );
      ?>
        <label for="<?= $that->slug ?>"><?= _e( ucfirst( $that->label )) ?></label>
        <input id="<?= $that->slug ?>" type="text" name="<?= $that->slug ?>" value="<?= esc_attr( $that->getValue( $post )) ?>">
      <?php
    };

    //NATHAN - META_BOX_IMAGE_INPUT_GENERATOR**************************************
     $that->meta_box_image_input_generator = function( $post ) use($that){
    	$url_parts = explode( '/', $that->getValue( $post ));
    	$value = esc_attr( array_pop( $url_parts ));
    	$nonce_html = wp_nonce_field( $that->slug, $that->slug . '_nonce', true );
    	$post_meta = get_post_meta($post->ID);
    	?>
    	
    	<?php if (isset ($post_meta['image'])){ ?>
        <p><?= $value ?></p>
        <img src="<?php echo $post_meta['image'][0]; ?>" width="100%"/>
    	<?php } ?>

	<label for="<?= $that->slug ?>"><?= _e( ucfirst( $that->label )) ?></label>
	<input id="<?= $that->slug ?>" type="file" name="<?= $that->slug ?>">
	
	<?php
    };//meta_box_image_input_generator
	
    $that->meta_box_file_input_generator = function( $post ) use ($that) {
      $url_parts = explode( '/', $that->getValue( $post ));
      $value = esc_attr( array_pop( $url_parts ));

      $nonce_html = wp_nonce_field( $that->slug, $that->slug . '_nonce', true );
      ?>
        <?php if( $value ): ?>
          <p>Current attachment: <?= $value ?></p>
        <?php endif; ?>
        <label for="<?= $that->slug ?>"><?= _e( ucfirst( $that->label )) ?></label>
        <input id="<?= $that->slug ?>" type="file" name="<?= $that->slug ?>">
        
      <?php
    };
 }

	function init( $meta_box_html_generator, $deserializeRequest, $dashboard_position ){
		$that=$this;
		$configureMetaBox = $that->createMetaBoxConfigurer(
			  $meta_box_html_generator,
			  $dashboard_position
	);

    $saveField = $that->createSerializer( $deserializeRequest );

    add_action( 'add_meta_boxes', $configureMetaBox );
    add_action( 'save_post', $saveField );
    add_action( 'post_edit_form_tag', function () {
		echo ' enctype="multipart/form-data"';
    });
  }

	function getValue( $post ) {
		$that=$this;
		return get_post_meta( $post->ID, $that->slug, true );
	}

  // Creates the form input for the dashboard meta box.
  public function createMetaBoxConfigurer( $htmlGenerator, $position = 'side' ) {
    $that = $this;
    return function() use ($position, $htmlGenerator, $that ) {
      add_meta_box(
        $that->slug,
        mb_convert_case( $that->name, MB_CASE_TITLE, 'UTF-8' ),
        $htmlGenerator,
        $that->model->name,
        $position
      );
    };
  }

  // Returns a function that will serialize a POSTed field.
  function createSerializer( $deserializeRequest ) {
    $that = $this;
    return function ( $post_id ) use ( $deserializeRequest,$that ) {
      // Authenticate and authorize.
      if( !isset( $_POST[ $that->slug . '_nonce' ])) return $post_id;
      $nonce = $_POST[ $that->slug . '_nonce' ];
      if( !wp_verify_nonce( $nonce, $that->slug )) return $post_id;
      if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return $post_id;
      if( !current_user_can( 'edit_post', $post_id )) return $post_id;

      // Save data.
      $data = $deserializeRequest( $_POST, $that->slug );
      update_post_meta( $post_id, $that->slug, $data);
    };
  }
}

PostField::$getBooleanFieldValue = function( $request, $slug ) {
  return ( isset( $request[ $slug ]) && $request[ $slug ])? 'true': '';
};

PostField::$getTextFieldValue = function( $request, $slug ) {
  return $request[ $slug ];
};

PostField::$getFileFieldValue = function( $request, $slug ) {
  if( !empty( $_FILES[ $slug ][ 'name' ])) {
    $upload = wp_upload_bits( $_FILES[ $slug ][ 'name' ], null, file_get_contents( $_FILES[ $slug ][ 'tmp_name' ]));
    if( isset( $upload[ 'error' ]) && $upload[ 'error' ] != 0 ) {
      wp_die( 'There was an error uploading your file: ' . $upload[ 'error' ]);
    } else {
      return $upload[ 'url' ];
    }
  }
};

PostField::$getGalleryFieldValue = function( $request, $slug ) {
    $upload = wp_upload_bits( $_FILES[ $slug ][ 'name' ], null, file_get_contents( $_FILES[ $slug ][ 'tmp_name' ]));
    if( isset( $upload[ 'error' ]) && $upload[ 'error' ] != 0 ) {
      wp_die( 'There was an error uploading your file: ' . $upload[ 'error' ]);
    } else {
      return $upload[ 'url' ];
    }
};
