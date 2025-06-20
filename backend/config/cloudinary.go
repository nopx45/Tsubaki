package config

import (
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

func CloudinaryInstance() (*cloudinary.Cloudinary, error) {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUD_NAME"),
		os.Getenv("CLOUD_API_KEY"),
		os.Getenv("CLOUD_API_SECRET"),
	)
	return cld, err
}
