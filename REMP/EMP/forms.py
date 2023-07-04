
from django import forms
from .models import User

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password']

    # Add any custom validation rules here, if needed
    def clean(self):
        cleaned_data = super().clean()
        # add custom validation logic here
        return cleaned_data
