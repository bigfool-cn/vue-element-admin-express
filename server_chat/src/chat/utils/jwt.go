package utils

import (
	jwt "github.com/dgrijalva/jwt-go"
	"strings"
	"time"
)

var jwtSecret = []byte("bigfool.cn")

var bearerStr = "Bearer "

type Claims struct {
	UserId int `json:"userid"`
	Username string `json:"username"`
	jwt.StandardClaims
}

type JwtDo struct {
}


func (JwtDo) GenerateToken(userid int, username string) (string, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(3 * time.Hour)

	claims := Claims{
		userid,
		username,
		jwt.StandardClaims {
			ExpiresAt : expireTime.Unix(),
			Issuer : "bigfool",
		},
	}

	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString(jwtSecret)

	return token, err
}

func (JwtDo) ParseToken(token string) (*Claims, error) {
	// 处理bearer前缀
	if strings.Contains(token,bearerStr) {
		token = strings.Replace(token,bearerStr,"",1)
	}
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}

	return nil, err
}

var Jwt = new(JwtDo)
