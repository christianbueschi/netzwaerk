### Application
set :application,   "netzwaerk"
set :theme_dir,     "netzwaerk"

## Server
server              "ssharedli01.sg.ch.namics.com", :all, :qa
set :deploy_to,     "/var/www/netzwaerk"
set :web_url,       "http://netzwaerk.namics.com"
set :user,          "namics"
set :port,          22
set :use_sudo,      false
set :error_log,     "#{deploy_to}/logs/error"
set :docroot_dir,   "web"
set :apache_group,  "apache"
set :chmod_rw,      "775"
set :chmod_r,       "755"

### Settings
set :keep_releases, 4

## Config (can't set in deploy.rb)
set :wp_uploads_dir, "#{docroot_dir}/wp-content/uploads"
set :wp_blogs_dir,   "#{docroot_dir}/wp-content/blogs.dir"
set :wp_cache_dir,   "#{docroot_dir}/wp-content/cache"
set :wp_authors_dir, "#{docroot_dir}/wp-content/authors"
set :wp_gallery_dir, "#{docroot_dir}/wp-content/gallery"
set :shared_config_path,  "#{shared_path}/config"
set :shared_content_path, "#{shared_path}/content"

### SCM
set :scm, :git
set :repository, "git@git.namics.com:namics/netzwaerk.git"
set :branch, "develop"
set :deploy_via, :remote_cache

