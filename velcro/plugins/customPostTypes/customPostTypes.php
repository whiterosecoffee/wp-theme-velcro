<?php

namespace core;
global $root;

require_once( __DIR__ . '/lib/post-field.php' );
require_once( __DIR__ . '/lib/taxonomy.php' );
require_once( __DIR__ . '/lib/apply-term.php' );

class PortfolioCpt {
	static function cptSettings() {

		$portfolio_model = new RegisterNewPostType();
			$portfolio_model->name 		= 'Projects';
			$portfolio_model->textDom 	= 'core-cpt-project';
			$portfolio_model->menuIcon 	= 'dashicons-welcome-write-blog';
			$portfolio_model->taxonomies = ['category', 'post_tag'];
			$portfolio_model->fields 	=  [
											"Address"				=> "text"
											//"Attach your Resume"	=> "file",
											//"Default Background"	=> "image",
											//"Add Images"			=> "gallery",
											//"Featured on Home Page"	=> "checkbox"
								          ];

		foreach ($portfolio_model->fields as $key => $value){
			initPostFields($key, $value, $portfolio_model->name);
		}

		$portfolio_model->init();
	}

}PortfolioCpt::cptSettings();

class BlogCpt {
	static function cptSettings() {
		$blog_model = new RegisterNewPostType();
			$blog_model->name 		= 'Testimonials';
			$blog_model->textDom 	= 'core-cpt-testimonial';
			$blog_model->menuIcon 	= 'dashicons-welcome-write-blog';
			$blog_model->taxonomies = ['category', 'post_tag'];
			$blog_model->fields 	= [
											"Address"				=> "text",
											//"Attach your Resume"	=> "file",
											"Default Background"	=> "image",
											"Featured on Home Page"	=> "checkbox"
								          ];

		foreach ($blog_model->fields as $key => $value){
			initPostFields($key, $value, $blog_model->name);
		}

		$blog_model->init();
	}
}//BlogCpt::cptSettings();



class RegisterNewPostType {
	function init() {
		add_action( 'init', array( $this, 'registerPostType' ));
	}

	function registerPostType() {
		register_post_type( $this->name, array(
          'show_in_rest'        => true,
          'hierarchical'		=> false,
		  'public'				=> true,
		  'supports'			=> array( 'title', 'editor', 'thumbnail'),
		  'has_archive'         => false,
		  //'rewrite'				=> array('slug' => ''),
		  'menu_icon'			=> $this->menuIcon,
		  'taxonomies'			=> $this->taxonomies,
		  'labels'				=> array(
			'name'					=> __( $this->name, 			$this->textDom ),
			'singular_name'			=> __( rtrim($this->name, "s"), $this->textDom )
			)
		));
	}
}

function initPostFields($fieldName, $fieldType, $cptName){

	switch ($fieldType) {
	    case "text":
			$fieldName = new PostField(
		      $cptName,
		      $fieldName,
		      $fieldName,
		      ''
			);
				$fieldName->init(
				  $fieldName->meta_box_text_input_generator,
				  PostField::$getTextFieldValue,
				  'side'
				);
			break;

	    case "checkbox":
			$fieldName = new PostField(
		      $cptName,
		      $fieldName,
		      $fieldName,
		      $fieldName
			);
				$fieldName->init(
				  $fieldName->meta_box_checkbox_generator,
				  PostField::$getBooleanFieldValue,
				  'side'
				);
			break;

	    case "file":
			$fieldName = new PostField(
				$cptName,
				$fieldName,
				$fieldName,
				'Upload a new file:'
			);
				$fieldName->init(
				  $fieldName->meta_box_file_input_generator,
				  PostField::$getFileFieldValue,
				  'side'
				);
			break;

	    case "image":
			$fieldName = new PostField(
				$cptName,
				'image',
				$fieldName,
				''
			);
				$fieldName->init(
				  $fieldName->meta_box_image_input_generator,
				  PostField::$getFileFieldValue,
				  'side'
				);
			break;

	}
}?>