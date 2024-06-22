from django.contrib import admin
from django.urls import path, include
 
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/products/', include('core.urls.products_urls')),
    path('api/categories/', include('core.urls.categories_urls')),
    path('api/users/', include('core.urls.users_urls')),
    path('api/orders/', include('core.urls.orders_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)