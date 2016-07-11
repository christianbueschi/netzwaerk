#####
# Capistrano Deployment Script
#   Docs: https://github.com/capistrano/capistrano/wiki/Capistrano-Tasks
#
#	Overview (x indicates automatic execution using deploy:setup)
#
#		lamp:
#		x	setup
#		x	create_symlink
#			testconfig
#			reload
#
#		wordpress:
#		x	setup
#		x	create_symlink
#		x	symlink_webicons
#			config
#			install_enable
#		x	install_disable
#		x	cleanup
#

## Log Level
logger.level = Logger::INFO # see Capistrano::Logger

## Stages
set :stages, %w(qa prod)
set :default_stage, "qa"

require 'capistrano_colors'
require 'colored'
require 'capistrano/ext/multistage'

## Override Capistrano
namespace :deploy do

	desc 'Show deployed revision'
	task :revision do
		puts "Date :"
		run "stat -c %y #{current_path}/REVISION"

		puts "Revision: "
		run "cat #{current_path}/REVISION"
	end

	task :migrations do
		# do nothing
	end
	task :finalize_update do
		# do nothing
	end
	task :start do
		# do nothing
	end
	task :stop do
		# do nothing
	end
	task :restart do
		# do nothing
	end

end

before "deploy:update_code" do
    print "--> Update Code... "
end

after "deploy:update_code" do
    puts "Done.".green
end

## General
namespace :lamp do

	## Setup
	desc "Setup shared directories and permissions after initial setup"
	task :setup, :roles => :all do
		print "--> Remove Capistrano specific directories... "
		run "rm -Rf #{shared_path}/log"
		run "rm -Rf #{shared_path}/pids"
		run "rm -Rf #{shared_path}/system"
		puts "Done.".green
	end

	## Symlink
	desc "Links settings"
	task :create_symlink, :roles => :all do

		print "--> Symlink .htaccess - Symlink, and Protect from being overwritten... "
		run "ln -nsf ../config/.htaccess-#{stage}.htaccess #{release_path}/#{docroot_dir}/.htaccess"
		run "chmod #{chmod_rw} #{release_path}/#{docroot_dir}/.htaccess"
		puts "Done.".green

		print "--> Symlink robots.txt... "
		run "ln -nsf ../config/robots-#{stage}.txt #{release_path}/#{docroot_dir}/robots.txt"
		puts "Done.".green

	end

	## Test
	desc "Test Apache Config"
	task :testconfig, :roles => :all, :except => { :no_release => true } do
		invoke_command "apache2ctl configtest", :via => run_method
	end

	## Reload
	desc "Reload Apache graceful"
	task :reload, :roles => :all, :except => { :no_release => true } do
		invoke_command "apache2ctl graceful", :via => run_method
	end

end

## WordPress specific
namespace :wordpress do

	## Setup
	desc "Setup shared directories and permissions after initial setup"
	task :setup, :roles => :all do

		print "--> Create shared directories... "
		run "mkdir -p #{shared_config_path}"
		run "mkdir -p #{shared_content_path}/uploads"
		run "mkdir -p #{shared_content_path}/blogs"
		run "mkdir -p #{shared_content_path}/cache"
		run "mkdir -p #{shared_content_path}/authors"
		run "mkdir -p #{shared_content_path}/gallery"
		puts "Done.".green

		print "--> Set Owner... "
		run "chown -R :#{apache_group} #{shared_content_path}"
		puts "Done.".green

		print "--> Set permissions... "
		run "chmod -R #{chmod_rw} #{shared_content_path}/*"
		puts "Done.".green

	end

	## Symlink
	desc "Links the correct settings file"
	task :create_symlink, :roles => :all do

		print "--> Set permissions... "
		run "chmod -R #{chmod_rw} #{release_path}"
		puts "Done.".green

		print "--> Symlink shared directories... "
		run "ln -nfs #{shared_content_path}/uploads   #{release_path}/#{wp_uploads_dir}"
		run "ln -nfs #{shared_content_path}/blogs     #{release_path}/#{wp_blogs_dir}"
		run "ln -nfs #{shared_content_path}/cache     #{release_path}/#{wp_cache_dir}"
		run "ln -nfs #{shared_content_path}/authors   #{release_path}/#{wp_authors_dir}"
		run "ln -nfs #{shared_content_path}/gallery   #{release_path}/#{wp_gallery_dir}"
		puts "Done.".green

		print "--> Symlink plugins & theme... "
		run "ln -nfs ../../../wp-theme    #{release_path}/#{docroot_dir}/wp-content/themes/#{theme_dir}"
		puts "Done.".green

		print "--> Symlink wp-config.php - Symlink, and protect from being overwritten... "
		run "ln -nsf ../config/wp-config-#{stage}.php #{release_path}/#{docroot_dir}/wp-config.php"
		run "chmod #{chmod_r} #{release_path}/#{docroot_dir}/wp-config.php"
		puts "Done.".green

		print "--> Symlink wp-credentials.php to shared config dir... "
		run "ln -nsf #{shared_config_path}/wp-credentials.php  #{release_path}/config/wp-credentials.php"
		puts "Done.".green

	end

	## Webicons
	desc "Links the webicons"
	task :symlink_webicons, :roles => :all do
		print "--> Links the webicons... "
		run "ln -nfs  ../wp-theme/_static/img/favicon.ico  #{release_path}/#{docroot_dir}/favicon.ico"
		puts "Done.".green
	end

	## Config
	desc "Copy Config"
	task :config, :roles => :all do

		print "--> Copy credentials file... "
		run "cp -u #{current_path}/resources/wp-credentials-sample.php  #{shared_config_path}/wp-credentials.php "
		puts "Done.".green

	end

	## Install Enable
	desc "Allow Install"
	task :install_enable, :roles => :all do

		print "--> Copy install.php... "
		run "cp -u #{current_path}/resources/wp-install.php  #{current_path}/#{docroot_dir}/wp-admin/install.php"
		run "cp -u #{current_path}/resources/wp-install-custom.php  #{current_path}/#{docroot_dir}/wp-content/install.php"
		puts "Done.".green

	end

	## Install Disable
	desc "Disallow Install"
	task :install_disable, :roles => :all do

		print "--> Remove install.php... "
		run "rm -f #{current_path}/#{docroot_dir}/wp-admin/install.php"
		run "rm -f #{current_path}/#{docroot_dir}/wp-content/install.php"
		run "rm -f #{current_path}/#{docroot_dir}/wp-config-sample.php"
		puts "Done.".green

	end

	## Cleanup
	desc "Cleanup"
	task :cleanup, :roles => :all do

		print "--> Remove Unused Scripts... "
		run "rm -Rf #{release_path}/tools"
		run "rm -Rf #{release_path}/Vagrantfile"
		run "rm -Rf #{release_path}/puphpet"
		run "rm -Rf #{release_path}/config/wp-config-loc.php"
		puts "Done.".green

	end

end

## Log Tails
namespace :tail do

  task :error do
    stream("tail -f #{error_log}")
  end

end

## Hook Methods
after "deploy:setup", "lamp:setup"
after "deploy:setup", "wordpress:setup"

after "deploy:create_symlink", "lamp:create_symlink"
after "deploy:create_symlink", "wordpress:create_symlink"
after "deploy:create_symlink", "wordpress:symlink_webicons"
after "deploy:create_symlink", "wordpress:install_disable"
after "deploy:create_symlink", "wordpress:cleanup"

after "deploy:update", "deploy:cleanup"
